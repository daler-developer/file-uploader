import classNames from 'classnames'

type Props = {
  isLoading: boolean,
  children: any,
  restProps?: {
    root?: object,
    spinner?: object
  },
  classes?: {
    root?: string,
    spinner?: string
  }
}

export default  ({ isLoading, restProps, classes, children }: Props) => {


  return (
    <button type="button" className={classNames('loading-button', classes?.root)} {...restProps?.root}>
      {children}
      {isLoading && (
        <div
          className={classNames('loading-button__spinner', classes?.spinner)}
          {...restProps?.spinner}
        />
      )}
    </button>
  )
}
