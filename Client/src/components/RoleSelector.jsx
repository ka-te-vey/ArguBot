import React from 'react';
import { User, ShieldAlert } from 'lucide-react';
import { useTheme } from './Theme';


export function RoleSelector({ selectRole, onSelectRole }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const roles = [
        {
            id: 'debater',
            label: 'Debater',
            description: 'State your stance and initiate arguments for the topic.',
            icon: User
        },
        {
            id: 'component',
            label: 'Component',
            description: 'Act as the opposing constituent and challenge viewpoints.',
            icon: ShieldAlert
        }
    ];


    return (
        <div className={`w-full border rounded-2xl p-4 md:p-5 mb-5 transition-colors ${isDark ? "bg-[#1E1E1F] border-zinc-800" : 
            "bg-white border-zinc-200/90 shadow-sm"                            
        }`}>
            <label className={`text-xs md:text-sm font-bold block mb-3 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                Select Your Role: 
            </label>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {roles.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectRole === item.id;
                    return (
                        <button
                            key={item.id}
                            type='button'
                            onClick={() => onSelectRole(item.id)}
                            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${isSelected                                                                                         
                                        ? "bg-purple-600/10 border-purple-500 text-purple-400" : isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"                            
                                        : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"                                 
                                    }`}
                        >
                            <div className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400'                              
                            }`}>
                            <Icon className='w-4.5 h-4.5'/>
                            </div>
                            <div>
                                <p className="text-xs font-extrabold uppercase tracking-wide">{item.label}</p>                     
                                <p className="text-[11px] opacity-75 mt-0.5 leading-relaxed">{item.description}</p>   
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )


}