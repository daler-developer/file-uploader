import { auth } from 'firebase'
import { signOut } from 'firebase/auth'
import Container from './Container'


type Props = {
  
}

export default ({ }: Props) => {

  const handleLogoutBtnClick = () => {
    signOut(auth)
  }

  return (
    <header className="header">
      <Container>
        <div className="header__body">
          <div className="header__left">
            <span className="header__logo material-icons-outlined">
              add_a_photo
            </span>
          </div>
          <div className="header__right">
            <button className="header__logout-btn" onClick={handleLogoutBtnClick}>
              Logout
            </button>
          </div>
        </div>
      </Container>
    </header>
  )
}

