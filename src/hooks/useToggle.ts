import {useState, useCallback} from 'react';

interface ToggleActions{
  toggle:()=>void;
  setTrue:()=>void;
  setFalse:()=>void;
  reset:()=>void;
}

/**
 * A custom hook for managing a boolean state.
 *
 * @param defaultValue - The initial value of the boolean state (defaults to false).
 * @returns An array containing the current boolean state and an object with functions to manipulate it.
 */
const useToggle=(defaultValue:boolean=false):[boolean,ToggleActions]=>{
  const[value,setValue]=useState<boolean>(defaultValue);

  /**
   * Toggles the boolean state.
   */
  const toggle=useCallback(()=>setValue(prevValue=>!prevValue),[setValue]);

  /**
   * Sets the boolean state to true.
   */
  const setTrue=useCallback(()=>setValue(true),[setValue]);

  /**
   * Sets the boolean state to false.
   */
  const setFalse=useCallback(()=>setValue(false),[setValue]);

  /**
   * Resets the boolean state to the default value.
   */
  const reset=useCallback(()=>setValue(defaultValue),[setValue,defaultValue]);

  return[
    value,
    {toggle,setTrue,setFalse,reset}
  ];
};

export default useToggle;