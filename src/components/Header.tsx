import { auth } from 'firebase'
import { signOut } from 'firebase/auth'
import Container from './Container'
import logo from 'assets/logo.jpg'


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
          <img className="header__logo" src={logo} />
          <button className="header__logout-btn" onClick={handleLogoutBtnClick}>
            <span className="header__logout-icon material-icons-outlined">logout</span>
            <span>Log out</span>
          </button>
        </div>
      </Container>
    </header>
  )
}

