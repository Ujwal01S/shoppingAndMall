"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"
import { FiSunrise } from "react-icons/fi"
import { AiFillMoon } from "react-icons/ai"





export default function ThemeSwitch(){
    const [mouted, setMouted] = useState(false);
    const {setTheme, resolvedTheme} = useTheme();

    useEffect(() => setMouted(true), [])

    if(!mouted) return(
        <Image
        src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
        width={36}
        height={36}
        sizes="36x36"
        alt="Loading Light/Dark Toggle"
        priority={false}
        title="Loading Light/Dark Toggle" 
        />
    )

    if(resolvedTheme === 'dark'){
        return <FiSunrise size={26} onClick={() => setTheme('light')} />
    }

    if(resolvedTheme === 'light'){
        return <AiFillMoon size={26} onClick={() => setTheme('dark')} />
    }

}