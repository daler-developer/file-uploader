import { nanoid } from "@reduxjs/toolkit"
import classNames from "classnames"
import { db, storage } from "firebase"
import { addDoc, collection } from 'firebase/firestore'
import { FirestorePost } from "firebase/documentTypes"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { FormikErrors, useFormik } from "formik"
import { SyntheticEvent, useRef, useState } from "react"
import { selectCurrentUser } from "redux/reducers/authReducer"
import { useAppDispatch, useAppSelector } from "utils/hooks"
import { commonActions, selectCurrentVisibleModal } from "redux/reducers/commonReducer"
import LoadingButton from "./LoadingButton"
import Modal from "./Modal"

type Props = {

}

type FormValues = {
  desc: string
}

export default ({}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [image, setImage] = useState<File | null>(null)

  const dispatch = useAppDispatch()

  const fileInputRef = useRef<HTMLInputElement>(null!)

  const isHidden = useAppSelector((state) => selectCurrentVisibleModal(state)) !== 'add-post'
  const currentUser = useAppSelector((state) => selectCurrentUser(state))

  const form = useFormik({
    initialValues: {
      desc: ''
    },
    validate(v) {
      const errors: FormikErrors<FormValues & { image: File | null }> = {}

      if (!v.desc.trim()) {
        errors.desc = 'empty desc'
      }

      if (!image) {
        errors.image = 'empty image'
      }

      return errors
    },
    async onSubmit(v) {
      try {
        setIsLoading(true)

        const imageRef = ref(storage, `images/${nanoid()}_${image!.name}`)

        await uploadBytes(imageRef, image!)

        const firestoreImage: FirestorePost = {
          authorUid: currentUser!.uid,
          imageUrl: await getDownloadURL(imageRef),
          likesCount: 0,
          desc: v.desc,
          isFavourite: false
        }

        await addDoc(collection(db, 'posts'), firestoreImage)

        dispatch(commonActions.openAlert({ type: 'success', text: 'Success' }))
      } catch {
        dispatch(commonActions.openAlert({ type: 'error', text: 'Error' }))
      } finally {
        form.resetForm()
        resetImage()
        setIsLoading(false)
      }
    }
  })

  const resetImage = () => {
    setImage(null)
    fileInputRef.current.value = ''
  }

  const handleModalClose = () => {
    dispatch(commonActions.setCurrentVisibleModal(null))
  }

  const handleRemoveSelectedImageClick = () => {
    resetImage()
  }

  const handleUploadImageBtnClick = () => {
    fileInputRef.current.click()
  }

  const handleFileInputChange = (e: SyntheticEvent) => {
    const files = (e.target as HTMLInputElement).files

    if (files) {
      setImage(files[0])
    } else {
      setImage(null)
    }
  }

  return <>
    <Modal isHidden={isHidden} title="Add image" className="add-post-modal__modal" onClose={handleModalClose}>
      <form className="add-post-modal__form" onSubmit={form.handleSubmit}>
        <input
          type="text"
          className={classNames('add-post-modal__desc-input', { 'add-post-modal__desc-input--error': form.touched.desc && form.errors.desc })}
          placeholder="Image description"
          {...form.getFieldProps('desc')}
        />

        {image ? (
          <div className="add-post-modal__selected-image-wrapper">
            <img  
              src={URL.createObjectURL(image)}
              className="add-post-modal__selected-image"
            />
            <button className="add-post-modal__remove-selected-image-btn" onClick={handleRemoveSelectedImageClick}>
              Remove
            </button>
          </div>
        ) : (
          <button type="button" className="add-post-modal__upload-image-btn" onClick={handleUploadImageBtnClick}>
            <span className="add-post-modal__icon material-icons-outlined">
              perm_media
            </span>
            Upload
          </button>
        )}

        <LoadingButton isLoading={isLoading} classes={{ root: 'add-post-modal__submit-btn' }} restProps={{ root: { type: 'submit' } }}>
          Submit
        </LoadingButton>
      </form>
    </Modal>

    <input type="file" ref={fileInputRef} onChange={handleFileInputChange} hidden />
  </>
}

