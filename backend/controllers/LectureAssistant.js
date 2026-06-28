const SubSection = require("../models/SubSection");
const Groq = require("groq-sdk");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const os = require("os");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


// Generate transcript using Whisper via Groq
exports.generateTranscript = async (req, res) => {
  try {
    const { subsectionId } = req.body;
    const subsection = await SubSection.findById(subsectionId);

    if (!subsection) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }

    if (subsection.transcript) {
      return res.status(200).json({ success: true, message: "Transcript already exists", data: subsection.transcript });
    }

    if (!subsection.videoUrl) {
      return res.status(400).json({ success: false, message: "No video URL found" });
    }

    // Download video to tmp file
    const tempFilePath = path.join(os.tmpdir(), `lecture-${subsectionId}.mp4`);
    const response = await axios({ method: "GET", url: subsection.videoUrl, responseType: "stream" });
    const writer = fs.createWriteStream(tempFilePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Transcribe using Groq Whisper
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-large-v3",
      language: "en",
    });

    // deleting tmp file
    fs.unlinkSync(tempFilePath);

    // Saving transcript
    subsection.transcript = transcription.text;
    await subsection.save();

    return res.status(200).json({ success: true, data: transcription.text });
  } catch (error) {
    console.error("GENERATE_TRANSCRIPT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Ask AI about the lecture
exports.askLectureAssistant = async (req, res) => {
  try {
    const { subsectionId, question, chatHistory } = req.body;

    if (!subsectionId || !question) {
      return res.status(400).json({ success: false, message: "Subsection ID and question required" });
    }

    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }

    let transcriptError = null;
    if ((!subsection.transcript || subsection.transcript === "") && subsection.videoUrl) {
      try {
        console.log("Auto-generating transcript for:", subsectionId);
        const tempVideoPath = path.join(os.tmpdir(), `lecture-${subsectionId}.mp4`);
        const tempAudioPath = path.join(os.tmpdir(), `lecture-${subsectionId}.mp3`);

        const videoResponse = await axios({
          method: "GET",
          url: subsection.videoUrl,
          responseType: "stream",
          timeout: 120000,
        });
        const writer = fs.createWriteStream(tempVideoPath);
        videoResponse.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        console.log("Video downloaded, extracting audio...");

        // Extract audio as compressed mp3
        await new Promise((resolve, reject) => {
          ffmpeg(tempVideoPath)
            .noVideo()
            .audioCodec("libmp3lame")
            .audioBitrate("64k")
            .audioChannels(1)
            .output(tempAudioPath)
            .on("end", resolve)
            .on("error", reject)
            .run();
        });

        fs.unlinkSync(tempVideoPath);

        const audioStats = fs.statSync(tempAudioPath);
        console.log("Audio file size:", (audioStats.size / 1024 / 1024).toFixed(2), "MB");

        if (audioStats.size > 25 * 1024 * 1024) {
          console.log("Audio still too large (>25MB), skipping");
          fs.unlinkSync(tempAudioPath);
          transcriptError = "Lecture audio is too large (>25MB) for transcription. AI will answer based on title and description only.";
        } else {
          console.log("Transcribing with Whisper...");
          const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(tempAudioPath),
            model: "whisper-large-v3",
            language: "en",
          });

          fs.unlinkSync(tempAudioPath);

          if (transcription.text && transcription.text.length > 0) {
            subsection.transcript = transcription.text;
            await subsection.save();
            console.log("Transcript saved, length:", transcription.text.length);
          } else {
            transcriptError = "Transcription returned empty result. The video may not contain clear speech.";
          }
        }
      } catch (err) {
        console.error("Auto-transcript failed:", err.message);
        transcriptError = `Transcript generation failed: ${err.message}`;

        // Cleaning up tmp files
        const tempVideoPath = path.join(os.tmpdir(), `lecture-${subsectionId}.mp4`);
        const tempAudioPath = path.join(os.tmpdir(), `lecture-${subsectionId}.mp3`);

        if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
        if (fs.existsSync(tempAudioPath)) fs.unlinkSync(tempAudioPath);
      }
    }

    if (transcriptError && (!subsection.transcript || subsection.transcript === "")) {
      return res.status(200).json({
        success: true,
        data: `⚠️ ${transcriptError}\n\nHowever, I can still try to help based on the lecture title: "${subsection.title}"\n\nPlease ask your question and I'll do my best!`,
        transcriptFailed: true,
      });
    }

    let lectureContext = `Lecture Title: ${subsection.title}\nDescription: ${subsection.description || "N/A"}`;
    if (subsection.transcript) {
      const trimmedTranscript = subsection.transcript.substring(0, 3000);
      lectureContext += `\n\nLecture Transcript:\n${trimmedTranscript}`;
    }

    const systemPrompt = `You are a helpful AI teaching assistant for an online learning platform called StudyNotion.
You are helping a student understand a specific lecture. Here is the lecture context:

${lectureContext}

Rules:
- Only answer questions related to this lecture's topic or the course subject.
- Keep answers concise, clear, and educational.
- If asked to summarize, provide key points from the transcript.
- If asked to generate a quiz, create 5 multiple-choice questions with correct answers marked.
- If asked to explain a concept, use simple language and examples.
- If the question is unrelated to the lecture, politely say you can only help with lecture-related topics.
- Format responses with markdown for readability.`;

    // Build messages array with chat history
    const messages = [{ role: "system", content: systemPrompt }];

    if (chatHistory && chatHistory.length > 0) {
      // Include last 6 messages for context
      const recentHistory = chatHistory.slice(-6);
      recentHistory.forEach((msg) => {
        messages.push({ role: msg.role, content: msg.content });
      });
    }

    messages.push({ role: "user", content: question });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const answer = completion.choices[0]?.message?.content;

    return res.status(200).json({ success: true, data: answer });
  } catch (error) {
    console.error("LECTURE_ASSISTANT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Get transcript for a lecture
exports.getTranscript = async (req, res) => {
  try {
    const { subsectionId } = req.body;
    const subsection = await SubSection.findById(subsectionId);

    if (!subsection) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }

    return res.status(200).json({
      success: true,
      data: subsection.transcript || "",
      hasTranscript: !!subsection.transcript,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
