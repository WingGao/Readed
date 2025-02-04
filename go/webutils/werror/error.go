package werror

func PanicError(err error) {
	if err != nil {
		panic(err)
	}
}
