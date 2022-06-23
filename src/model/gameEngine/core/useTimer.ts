import { useEffect, useRef, useState } from "react";

/**
 * 
 * @param callback the callback to call (with the time interval, in milliseconde, in parameter)
 */
export function useTimer() :
[
    ((timeElapsed : number) => void) | undefined,
    (setNewCallback : (timeElapsed: number) => void) => void
    ] {
    const [callback, setCallback] = useState<((timeElapsed : number) => void) | undefined>(undefined);
    // to get the next time
    const requestRef = useRef<number>();
    // to get delta
    const previousTimeRef = useRef<number>();
    
    

    useEffect(() => {
        if(callback !== undefined){
            const animate = (time : number) => {
                if (previousTimeRef.current != undefined) {
                    const deltaTime = time - previousTimeRef.current;
                    callback(deltaTime);
                }
                previousTimeRef.current = time;
                requestRef.current = requestAnimationFrame(animate);
            };


            requestRef.current = requestAnimationFrame(animate);
            
            return () => {
                if(requestRef.current !== undefined){
                    cancelAnimationFrame(requestRef.current); 
                }
            };// when the callbaack is change, we cancel the previous one
        }
    }, [callback]); // Make sure the effect runs only once


    const setNewCallback = (newCallback : (timeElapsed : number) => void) => {
        setCallback(() => {return newCallback;});
    };

    return [callback, setNewCallback];
}