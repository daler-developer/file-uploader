import classNames from "classnames"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { commonActions } from "redux/reducers/commonReducer"
import { ReduxPost } from "redux/reducers/postsReducer"

type Props = {
  data: ReduxPost,
  classes?: {
    root?: string
  }
}

export default  ({ data, classes }: Props) => {
  const [isMenuHidden, setIsMenuHidden] = useState<boolean>(true)

  const dispatch = useDispatch()

  const handleOpenMenuBtnClick = () => {
    setIsMenuHidden(false)
  }

  const handleViewBtnClick = () => {
    dispatch(commonActions.setImageViewingUrl(data.imageUrl))
  }

  return (
    <div className={classNames('post', classes?.root)}>

      <div className="post__left">
        <img
          src={data.imageUrl}
          alt="Image"
          className="post__img"
        />
      </div>

      <div className="post__right">
        <button className="post__open-menu-btn" onClick={handleOpenMenuBtnClick}>
          <span className="post__icon post__more-icon material-icons-outlined">
            more_vert
          </span>
        </button>
      </div>

    </div>
  )
}
