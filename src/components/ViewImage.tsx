import classNames from "classnames"
import { useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { commonActions, selectImageViewingUrl } from "redux/reducers/commonReducer"
import { useAppSelector, useOnClickOutside } from "utils/hooks"

type Props = {

}

export default  ({}: Props) => {
  const imgRef = useRef<HTMLImageElement>(null!)

  const [imgScale, setImgScale] = useState<number>(1)
  const [imgRotationDegree, setImgRotationDegree] = useState<number>(0)

  // useOnClickOutside(imgRef, () => dispatch(commonActions.setImageViewingUrl(null)))

  const dispatch = useDispatch()

  const imageUrl = useAppSelector((state) => selectImageViewingUrl(state))

  const handleCloseBtnClick = () => {
    dispatch(commonActions.setImageViewingUrl(null))
  }

  const handleZoomInBtnClick = () => {
    setImgScale(imgScale + 0.05)
  }

  const handleZoomOutBtnClick = () => {
    setImgScale(imgScale - 0.05)
  }

  const handleRotateLeftBtnClick = () => {
    setImgRotationDegree(imgRotationDegree - 5)
  }

  const handleRotateRightBtnClick = () => {
    setImgRotationDegree(imgRotationDegree + 5)
  }

  return (
    <div className={classNames('view-image', { 'view-image--hidden': !imageUrl })}>
      
      {imageUrl && (
        <img
          className="view-image__img"
          src={imageUrl}
          ref={imgRef}
          style={{
            transform: `scale(${imgScale}) rotate(${imgRotationDegree}deg)`
          }}
        />
      )}

      <ul className="view-image__actions">
        <li className="view-image__actions-item">
          <button type="button" className="view-image__actions-btn" onClick={handleZoomInBtnClick}>
            <span className="view-image__icon view-image__actions-icon material-icons-outlined">
              add
            </span>
          </button>
        </li>
        <li className="view-image__actions-item">
          <button type="button" className="view-image__actions-btn" onClick={handleZoomOutBtnClick}>
            <span className="view-image__icon view-image__actions-icon material-icons-outlined">
              remove
            </span>
          </button>
        </li>
        <li className="view-image__actions-item">
          <button type="button" className="view-image__actions-btn" onClick={handleRotateRightBtnClick}>
            <span className="view-image__icon view-image__actions-icon material-icons-outlined">
              rotate_right
            </span>
          </button>
        </li>
        <li className="view-image__actions-item">
          <button type="button" className="view-image__actions-btn" onClick={handleRotateLeftBtnClick}>
            <span className="view-image__icon view-image__actions-icon material-icons-outlined">
              rotate_left
            </span>
          </button>
        </li>
        <li className="view-image__actions-item">
          <button type="button" className="view-image__actions-btn" onClick={handleCloseBtnClick}>
            <span className="view-image__icon view-image__actions-icon material-icons-outlined">
              close
            </span>
          </button>
        </li>
      </ul>

      {/* <button className="view-image__close-btn" onClick={handleCloseBtnClick}>
        <span className="view-image__close-icon material-icons-outlined">
          close
        </span>
      </button> */}

    </div>
  )
}
