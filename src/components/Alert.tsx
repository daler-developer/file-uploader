import classNames from "classnames"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { commonActions, selectAlert } from "redux/reducers/commonReducer"
import { useAppSelector } from "utils/hooks"


type Props = {

}

export default ({}: Props) => {

  const dispatch = useDispatch()

  const alert = useAppSelector((state) => selectAlert(state))

  const isHidden = () => {
    return !Boolean(alert)
  }

  useEffect(() => {
    if (!isHidden()) {
      setTimeout(() => {
        dispatch(commonActions.closeAlert())
      }, 2000)
    }
  }, [isHidden()])


  return (
    <div className={classNames('alert', {
      'alert--hidden': isHidden(),
      'alert--success': alert?.type === 'success',
      'alert--error': alert?.type === 'error' 
    })}>
      {alert?.text}
    </div>
  )
}
