import { ref, type Ref } from "vue";

export function useInput<T = string>(initialValue: T = "" as unknown as T) {
  const value: Ref<T> = ref(initialValue) as Ref<T>;

  function onValueChange(e: Event | { target: { value: any } } | any) {
    if (e && e.target !== undefined) {
      value.value = e.target.value;
    } else {
      value.value = e;
    }
  }

  function setValue(newValue: T) {
    value.value = newValue;
  }

  return [value, onValueChange, setValue] as const;
}

