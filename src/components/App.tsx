import { onAuthStateChanged } from '@firebase/auth'
import { doc, getDoc } from '@firebase/firestore'
import { auth, db } from 'firebase'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect, Route, Switch, useHistory } from 'react-router'
import { authActions } from 'redux/reducers/authReducer'
import 'scss/index.scss'
import Alert from './Alert'
import AuthenticatedRoute from './AuthenticatedRoute'
import ViewImage from './ViewImage'
import AuthPage from './AuthPage'
import ProfilePage from './ProfilePage'
import UsersPage from './UsersPage'
import AddPostModal from './AddPostModal'
import Modal from './Modal'
import AddCategoryModal from './AddCategoryModal'


type Props = {
  
}

export default (props: Props) => {

  const dispatch = useDispatch()

  const history = useHistory()

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(authActions.login(user.providerData[0]))
        history.push('/profile')
      } else {
        dispatch(authActions.logout())
        history.push('/auth?tab=login')
      }
    })
  }, [])

  return <>
    <div className="app">
      <Switch>

        <Route path="/" exact>
          <Redirect to="/profile" />
        </Route>

        <Route path="/auth" exact>
          <AuthPage />
        </Route>

        <AuthenticatedRoute path="/profile" exact>
          <ProfilePage />
        </AuthenticatedRoute>

        <AuthenticatedRoute path="/users" exact>
          <UsersPage />
        </AuthenticatedRoute>

      </Switch>
    </div>

    <ViewImage />
    <Alert />
    <AddPostModal />
    <AddCategoryModal />
  </>
}
