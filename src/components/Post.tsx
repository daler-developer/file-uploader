import classNames from "classnames"
import { db, storage } from "firebase"
import { deleteDoc, doc, updateDoc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import { useRef, useState } from "react"
import { selectCurrentUser } from "redux/reducers/authReducer"
import { commonActions } from "redux/reducers/commonReducer"
import { postsActions, ReduxPost } from "redux/reducers/postsReducer"
import { formatBytes } from "utils/helpers"
import { useAppDispatch, useAppSelector } from "utils/hooks"
import PopupMenu from "./PopupMenu"
import { motion } from 'framer-motion'

type Props = {
  data: ReduxPost,
  classes?: {
    root?: string
  }
}

export default  ({ data, classes }: Props) => {
  const [isPopupHidden, setIsPopupHidden] = useState<boolean>(true)
  const [isImgLoading, setIsImgLoading] = useState<boolean>(true)
  const [isDeletingLoading, setIsDeletingLoading] = useState<boolean>(false)

  const downloadLinkRef = useRef<HTMLAnchorElement>(null!)

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
      setIsDeletingLoading(true)

      // update firebase state
      await deleteDoc(doc(db, 'posts', data.id))
      await deleteObject(ref(storage, data.image.path))
      
      // update redux state
      dispatch(postsActions.deletePost(data.id))

      dispatch(commonActions.openAlert({ type: 'success', text: 'Deleted' }))
    } catch {
      dispatch(commonActions.openAlert({ type: 'error', text: 'Cannot delete' }))
    } finally {
      setIsDeletingLoading(false)
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

  const handleDownloadImageBtnClick = async () => {
    const response = await fetch(data.image.url)
    const blob = await response.blob()

    
    downloadLinkRef.current.click()
  }

  return (
    <div className={classNames('post', classes?.root)} title={data.desc}>

      <div className="post__body">

        <div className="post__img-wrapper">
          <div className={classNames('post__img-loader', { 'post__img-loader--hidden': !isImgLoading })}>
            <div className="post__img-loader-spinner" />
          </div>
          <img
            src={data.image.url}
            alt="Image"
            className={classNames('post__img', { 'post__img--hidden': isImgLoading })}
            onLoad={handleImgLoad}
          />
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
            {formatBytes(data.image.size)}
            <span className="post__dot" />
            {getGeneratedCreatedDate()}
          </div>
        </div>

      </div>

      <div className="post__actions">
        <motion.button type="button" className="post__actions-btn post__download-btn post__download-img-btn" onClick={handleDownloadImageBtnClick} whileTap={{ scale: .9 }}>
          <span className="post__icon material-icons-outlined">
            download
          </span>
        </motion.button>
        {data.isFavourite ? (
          <motion.button className="post__actions-btn post__actions-remove-favourite-btn" onClick={handleRemoveFromFavoruteBtnClick} whileTap={{ scale: .9 }}>
            <span className="post__icon post__heart-icon post__heart-filled-icon material-icons-outlined">
              favorite
            </span>
          </motion.button>
        ) : (
          <motion.button className="post__actions-btn" onClick={handleMoveToFavoruteBtnClick} whileTap={{ scale: .9 }}>
            <span className="post__icon post__heart-icon post__heart-unfilled-icon material-icons-outlined">
              favorite_border
            </span>
          </motion.button>
        )}
        <motion.button className="post__actions-btn post__actions-delete-btn" onClick={handleDeletePostBtnClick} whileTap={{ scale: .9 }}>
          <span className="post__icon material-icons-outlined">
            delete
          </span>
        </motion.button>
        <motion.button className={classNames('post__actions-btn post__actions-open-menu-btn', 'post__actions-open-menu-btn--hidden')} onClick={handleOpenMenuBtnClick} whileTap={{ scale: .9 }}>
          <span className="post__icon post__more-icon material-icons-outlined">
            more_vert
          </span>
        </motion.button>
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

      <a ref={downloadLinkRef} download hidden>download</a>
    </div>
  )
}
