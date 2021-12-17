import classNames from "classnames"
import { useDispatch } from "react-redux"
import { commonActions, selectImageViewingUrl } from "redux/reducers/commonReducer"
import { useAppSelector } from "utils/hooks"

type Props = {

}

export default  ({}: Props) => {

  const dispatch = useDispatch()

  const imageUrl = useAppSelector((state) => selectImageViewingUrl(state))

  const handleCloseBtnClick = () => {
    dispatch(commonActions.setImageViewingUrl(null))
  }

  return (
    <div className={classNames('view-image', { 'view-image--hidden': !imageUrl })}>
      
      {imageUrl && (
        <img
          className="view-image__img"
          src={imageUrl}
        />
      )}

      <button className="view-image__close-btn" onClick={handleCloseBtnClick}>
        <span className="view-image__close-icon material-icons-outlined">
          close
        </span>
      </button>

    </div>
  )
}
