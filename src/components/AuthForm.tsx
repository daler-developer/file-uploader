import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '@firebase/auth'
import classNames from 'classnames'
import { auth } from 'firebase'
import { FormikErrors, useFormik } from 'formik'
import { useEffect, useState } from 'react'
import LoadingButton from './LoadingButton'
import { useQuery } from 'utils/hooks'
import { useHistory, useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { commonActions } from 'redux/reducers/commonReducer'


type Props = {

}

type FormValues = {
  email: string,
  displayName: string,
  password: string
}

type TabType = 'login' | 'register'

export default  ({}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const query = useQuery()
  const history = useHistory()
  const location = useLocation()

  const dispatch = useDispatch()

  useEffect(() => {
    if (!isValidTabSelected()) {
      history.push(`${location.pathname}?tab=login`)
    }
  }, [])

  const form = useFormik({
    initialValues: {
      email: '',
      password: '',
      displayName: ''
    },
    validate(v) {
      const errors: FormikErrors<FormValues> = {}
      
      if (!v.email.trim()) {
        errors.email = 'Empty email'
      }

      // if (!v.displayName.trim() && getSelectedTab() === 'register') {
      //   errors.displayName = 'Empty display name'
      // }

      if (!v.password.trim()) {
        errors.password = 'Empty password'
      }

      return errors
    },
    async onSubmit(v) {
      try {
        setIsLoading(true)

        if (getSelectedTab() === 'register') {

          await createUserWithEmailAndPassword(auth, v.email, v.password)

          dispatch(commonActions.openAlert({ type: 'success', text: 'Signed up' }))

        } else if (getSelectedTab() === 'login') {

          await signInWithEmailAndPassword(auth, v.email, v.password)
          dispatch(commonActions.openAlert({ type: 'success', text: 'Signed in' }))
          
        }

      } catch (e) {
        console.log(e)
        dispatch(commonActions.openAlert({ type: 'error', text: 'Error' }))
      } finally {
        setIsLoading(false)
        form.resetForm()
      }
    }
  })

  const getSelectedTab = (): TabType => {
    return query.get('tab') as TabType
  }

  const isValidTabSelected = (): boolean => {
    if (getSelectedTab() !== 'login' && getSelectedTab() !== 'register' && !getSelectedTab()) {
      return false
    }

    return true
  }

  return (
    <form className="auth-form" onSubmit={form.handleSubmit}>
      <h1 className="auth-form__title">
        {getSelectedTab() === 'login' && 'Login'}
        {getSelectedTab() === 'register' && 'Register'}
      </h1>
      <div className="auth-form__input-group">
        <div className="auth-form__icon-wrapper">
          <span className="auth-form__icon material-icons-outlined">email</span>
        </div>
        <input
          type="text"
          className={classNames('auth-form__input', { 'auth-form__input--error': form.touched.email && form.errors.email })}
          placeholder="Email"
          {...form.getFieldProps('email')}
        />
      </div>
      {/* {getSelectedTab() === 'register' && (
        <div className="auth-form__input-group">
          <div className="auth-form__icon-wrapper">
            <span className="auth-form__icon material-icons-outlined">manage_accounts</span>
          </div>
          <input
            type="text"
            className={classNames('auth-form__input', { 'auth-form__input--error': form.touched.displayName && form.errors.displayName })}
            placeholder="Display name"
            {...form.getFieldProps('displayName')}
          />
        </div>
      )} */}
      <div className="auth-form__input-group">
        <div className="auth-form__icon-wrapper">
          <span className="auth-form__icon material-icons-outlined">lock</span>
        </div>
        <input
          type="password"
          className={classNames('auth-form__input', { 'auth-form__input--error': form.touched.password && form.errors.password })}
          placeholder="Password"
          {...form.getFieldProps('password')}
        />
      </div>
      <LoadingButton isLoading={isLoading} classes={{ root: 'auth-form__submit-btn' }} restProps={{ root: { type: 'submit' } }}>
        {getSelectedTab() === 'login' && 'Login'}
        {getSelectedTab() === 'register' && 'Register'}
      </LoadingButton>

      {getSelectedTab() === 'register' && (
        <Link to={`${location.pathname}?tab=login`} className="auth-form__footer-link">
          Already have an account? Login
        </Link>
      )}

      {getSelectedTab() === 'login' && (
        <Link to={`${location.pathname}?tab=register`} className="auth-form__footer-link">
          Don't have an account? Sign Up
        </Link>
      )}
    </form>
  )
}
