import classNames from "classnames"
import { db, storage } from "firebase"
import { FirestorePost } from "firebase/documentTypes"
import { deleteDoc, doc, updateDoc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import { useState } from "react"
import { selectCurrentUser } from "redux/reducers/authReducer"
import { commonActions } from "redux/reducers/commonReducer"
import { postsActions, ReduxPost } from "redux/reducers/postsReducer"
import { formatBytes } from "utils/helpers"
import { useAppDispatch, useAppSelector } from "utils/hooks"
import PopupMenu from "./PopupMenu"

type Props = {
  data: ReduxPost,
  classes?: {
    root?: string
  }
}

export default  ({ data, classes }: Props) => {
  const [isPopupHidden, setIsPopupHidden] = useState<boolean>(true)
  const [isImgLoading, setIsImgLoading] = useState<boolean>(true)

  const dispatch = useAppDispatch()

  const currentUser = useAppSelector((state) => selectCurrentUser(state))

  const getGeneratedCreatedDate = (): string => {
    const date = new Date(Date.parse(data.image.createdAt))

    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  }

  const handleOpenMenuBtnClick = () => {
    setIsPopupHidden(false)
  }

  const handleViewBtnClick = () => {
    dispatch(commonActions.setImageViewingUrl(data.image.url))
  }

  const handleDeletePostBtnClick = async () => {
    try {
      // update firebase state
      await deleteDoc(doc(db, 'posts', data.id))
      await deleteObject(ref(storage, data.image.path))
      
      // update redux state
      dispatch(postsActions.deletePost(data.id))

      dispatch(commonActions.openAlert({ type: 'success', text: 'Deleted' }))
    } catch {
      dispatch(commonActions.openAlert({ type: 'error', text: 'Cannot delete' }))
    } finally {

    }
  }

  const handleMoveToFavoruteBtnClick = async () => {
    try {
      // update firestore
      await updateDoc(doc(db, 'posts', data.id), {
        isFavourite: true
      })

      // update redux state
      dispatch(postsActions.makePostFavourite(data.id))

    } catch {

    } finally {

    }
  }

  const handleRemoveFromFavoruteBtnClick = async () => {
    // update firestore
    await updateDoc(doc(db, 'posts', data.id), {
      isFavourite: false
    })

    // update redux state
    dispatch(postsActions.removePostFavourite(data.id))
  }

  const handleImgLoad = () => {
    setIsImgLoading(false)
  }

  return (
    <div className={classNames('post', classes?.root)} title={data.desc}>

      <div className="post__left">

        <div className="post__img-wrapper">
          <img
            src={data.image.url}
            alt="Image"
            className="post__img"
            onLoad={handleImgLoad}
          />
          {/* {isImgLoading ? (
            <div className="post__img-loader">

            </div>
          ) : (
            <img
              src={data.image.url}
              alt="Image"
              className="post__img"
              onLoad={handleImgLoad}
            />
          )} */}
          <button type="button" className="post__view-img-btn" onClick={handleViewBtnClick}>
            <span className="post__icon post__see-icon material-icons-outlined">
              visibility
            </span>
          </button>
        </div>

        <div className="post__info">
          <p className="post__desc">
            {data.desc}
          </p>
          <div className="post__meta-data">
            {'2.3 MB'}
            <span className="post__dot" />
            {getGeneratedCreatedDate()}
          </div>
        </div>

      </div>

      <div className="post__right">
        <button type="button" className="post__download-btn post__download-img-btn">
          <span className="post__icon material-icons-outlined">
            download
          </span>
        </button>
        {data.isFavourite ? (
          <button className="post__icon post__heart-icon post__heart-filled-icon material-icons-outlined" onClick={handleRemoveFromFavoruteBtnClick}>
            favorite
          </button>
        ) : (
          <button className="post__icon post__heart-icon post__heart-unfilled-icon material-icons-outlined" onClick={handleMoveToFavoruteBtnClick}>
            favorite_border
          </button>
        )}
        <button className="post__open-menu-btn" onClick={handleOpenMenuBtnClick}>
          <span className="post__icon post__more-icon material-icons-outlined">
            more_vert
          </span>
        </button>
      </div>

      <PopupMenu isHidden={isPopupHidden} onClose={() => setIsPopupHidden(true)} className="post__popup-menu">
        <ul className="post__popup-menu-btns">
          <li className="post__popup-menu-btns-item">
            <button className="post__popup-menu-btn" onClick={handleDeletePostBtnClick}>
              <span className="post__icon post__popup-menu-icon material-icons-outlined">
                delete
              </span>
              Delete
            </button>
          </li>
          {!data.isFavourite ? (
            <li className="post__popup-menu-btns-item">
              <button className="post__popup-menu-btn" onClick={handleMoveToFavoruteBtnClick}>
                <span className="post__icon post__popup-menu-icon material-icons-outlined">
                  favorite_border
                </span>
                Move to favourite
              </button>
            </li>
          ) : (
            <li className="post__popup-menu-btns-item">
              <button className="post__popup-menu-btn" onClick={handleRemoveFromFavoruteBtnClick}>
                <span className="post__icon post__popup-menu-icon material-icons-outlined">
                  favorite_border
                </span>
                Remove from favourite
              </button>
            </li>
          )}
        </ul>
      </PopupMenu>
    </div>
  )
}
