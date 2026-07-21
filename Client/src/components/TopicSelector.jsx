import React from 'react';
import { useTheme } from './Theme';

const TOPIC_LABELS = [
    { id: 'AI', label: '🤖 AI' },
    { id: 'Weather', label: '🌦️ Weather' },
    { id: 'Polictic', label: '🏛️ Politics' },
    { id: 'Tech', label: '📱 Tech' },
    { id: 'Healthy', label: '🩺 Health' },
    { id: 'Economy', label: '💰 Economy' },
    { id: 'Education', label: '🎓 Education' },
    { id: 'Gaming', label: '🎮 Gaming' }
];

export function TopicSelector({ selectCategory, onSelectCategory }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`w-full border rounded-2xl p-4 md:p-5 mb-5 transition-colors ${isDark ? "bg-[#1E1E1F] border-zinc-800" 
                        : "bg-white border-zinc-200/90 shadow-xs"}`}>
            <label className={`text-xs md:text-sm font-bold block mb-3 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                Select Topic Tag:
            </label>
            <div className='flex flex-wrap gap-2'>
                {TOPIC_LABELS.map((item) => (
                    <button
                        key={item.id}
                        type='button'
                        onClick={() => 
                            onSelectCategory(selectedCategory === item.label ? '' : item.label)
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${ selectedCategory === item.label ? "bg-purple-600 text-white border-purple-500 shadow-md"                                                          
                    : isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700" : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200/70"}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    )
};
