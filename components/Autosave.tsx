import diff from "object-diff";
import { memo, useState } from "react";
import { FormSpy } from "react-final-form";

export interface AutosaveProps {
  debounce: number;
  save: (values: any) => void;
}

const Autosave = ({ debounce, save }: AutosaveProps) => {
  const [values, setValues] = useState({})
  let timeout: NodeJS.Timeout;


  return <FormSpy
    subscription={{ values: true, modified: true }}
    onChange={props => {

      if (!props.modified) return;

      const checkDirty = Object.keys(props.modified).some(k => props.modified && props.modified[k] === true)
      const difference = diff(values, props.values)


      if (checkDirty && Object.keys(difference).length) {
        if (timeout) clearTimeout(timeout)

        timeout = setTimeout(() => {
          setValues(props.values)
          return save(props.values)
        }, debounce)
      }
    }} />
}

export default memo(Autosave)