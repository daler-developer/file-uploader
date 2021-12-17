import classNames from "classnames"
import { useRef } from "react"
import { useOnClickOutside } from "utils/hooks"

type Props = {
  title: string,
  children: any,
  isHidden: boolean,
  onClose: Function,
  className?: string,
}

export default ({ className, children, isHidden, title, onClose }: Props) => {
  const modalRef = useRef<any>(null!)

  useOnClickOutside(modalRef, () => {
    onClose()
  })

  const handleCloseBtnClick = () => {
    onClose()
  }

  return (
    <div className={classNames('modal', { 'modal--hidden': isHidden })}>
      <div className={classNames('modal__wrapper', className)} ref={modalRef}>

        <div className="modal__header">
          <h2 className="modal__title">
            {title}
          </h2>
          <button className="modal__close-btn" onClick={handleCloseBtnClick}>
            <span className="modal__icon modal__close-icon material-icons-outlined">
              close
            </span>
          </button>
        </div>

        <div className="modal__body">
          {children}
        </div>

      </div>
    </div>
  )
}
