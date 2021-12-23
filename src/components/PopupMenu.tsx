import classNames from 'classnames'
import { useRef } from 'react'
import { useOnClickOutside } from 'utils/hooks'


type Props = {
  isHidden: boolean,
  children: any,
  className?: string,
  onClose: Function
}

export default ({ children, isHidden, className, onClose }: Props) => {
  const rootRef = useRef<HTMLDivElement>(null!)

  useOnClickOutside(rootRef, () => {
    onClose()
  }, [!isHidden])

  return (
    <div className={classNames('popup-menu', { 'popup-menu--hidden': isHidden }, className)} ref={rootRef}>
      {children}
    </div>
  )
}
