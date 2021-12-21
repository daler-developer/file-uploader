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
  },
  className?: string,
  type?: 'button' | 'reset' | 'submit'
}

export default  ({ isLoading, className, restProps, classes, children, type }: Props) => {


  return (
    <button {...restProps?.root} type={type || 'button'} className={classNames('loading-button', classes?.root, className)}>
      {isLoading ? (
        <div
          className={classNames('loading-button__spinner', classes?.spinner)}
          {...restProps?.spinner}
        />
      ) : children}
    </button>
  )
}
