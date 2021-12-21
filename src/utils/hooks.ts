import { RefObject, useEffect, useMemo } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { AppDispatch, RootState } from 'redux/store'


export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useQuery = () => {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

export const useOnClickOutside = (ref: RefObject<HTMLElement>, handler: Function, conditions?: boolean[]) => {
  useEffect(() => {
    const listener = (e: any) => {
      if (!ref.current || ref.current.contains(e.target)) {
        return
      }

      if (conditions && !conditions.every((el) => Boolean(el) === true)) {
        return 
      }

      handler(e)
    }

    document.addEventListener('click', listener)

    return () => {
      document.removeEventListener('click', listener)
    };
  }, [ref, handler])
}
