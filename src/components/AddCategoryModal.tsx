import classNames from "classnames"
import { db } from "firebase"
import { FirestoreCategory } from "firebase/documentTypes"
import { addDoc, collection } from "firebase/firestore"
import { FormikErrors, useFormik } from "formik"
import { commonActions, selectCurrentVisibleModal } from "redux/reducers/commonReducer"
import { useAppDispatch, useAppSelector } from "utils/hooks"
import LoadingButton from "./LoadingButton"
import Modal from "./Modal"

type Props = {

}

type FormValues = {
  name: string
}

export default ({}: Props) => {
  const form = useFormik<FormValues>({
    initialValues: {
      name: ''
    },
    validate(v) {
      const errors: FormikErrors<FormValues> = {}

      if (!v.name.trim()) {
        errors.name = 'Empty name'
      }

      return errors
    },
    async onSubmit(v) {
      try {
        const category: FirestoreCategory = {
          name: v.name
        }

        await addDoc(collection(db, 'categories'), category)
      } catch {
        dispatch(commonActions.openAlert({ type: 'error', text: 'Cannot create category' }))
      } finally {
        dispatch(commonActions.openAlert({ type: 'success', text: 'Created category' }))
      }
    }
  })

  const dispatch = useAppDispatch()

  const isHidden = useAppSelector((state) => selectCurrentVisibleModal(state)) !== 'add-category'

  const handleClose = () => {
    dispatch(commonActions.setCurrentVisibleModal(null))
  }

  return (
    <Modal title="Add Category" className="add-category-modal" isHidden={isHidden} onClose={handleClose}>
      <form onSubmit={form.handleSubmit} className="add-category-modal__form">
        <input
          type="text"
          className={classNames('add-category-modal__name-input', { 'add-category-modal__name-input--error': form.touched.name && form.errors.name })}
          placeholder="Category name"
          {...form.getFieldProps('name')}
        />

        <LoadingButton isLoading={form.isSubmitting} className="add-category-modal__submit-btn" type="submit">
          Create
        </LoadingButton>
      </form>
    </Modal>
  )
}
