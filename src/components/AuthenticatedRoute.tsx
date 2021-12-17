import { Route } from 'react-router-dom'
import { selectIsAuthenticated } from 'redux/reducers/authReducer'
import { useAppSelector } from 'utils/hooks'

type Props = {
  children: any,
  exact: boolean,
  path: string,
  restProps?: object
}

export default ({ children, path, exact, restProps }: Props) => {

  const isAuthenticated = useAppSelector((state) => selectIsAuthenticated(state))

  return <>
    {isAuthenticated ? (
      <Route {...restProps} path={path} exact={exact}>
        {children}
      </Route>
    ) : null}
  </>
}
