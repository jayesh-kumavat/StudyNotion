export default function Tab({ tabData, field, setField }) {
  return (
    <div className="flex rounded-xl bg-slate-100 dark:bg-slate-700 p-1 gap-1 max-w-max">
      {tabData.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setField(tab.type)}
          className={`rounded-lg py-2 px-5 text-sm font-medium transition-all duration-200 ${
            field === tab.type
              ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
          }`}
        >
          {tab?.tabName}
        </button>
      ))}
    </div>
  )
}
