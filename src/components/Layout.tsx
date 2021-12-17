import classNames from 'classnames'
import Header from './Header'
import Container from './Container'


type Props = {
  children: any,
  classes?: {
    root?: string
  }
}

export default  ({ children, classes }: Props) => {
  return <>
    <div className={classNames('layout', classes?.root )}>
      <Container>
        {children}
      </Container>
    </div>

    <Header />
  </>
}
