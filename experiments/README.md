Just experiments.

To get env set up:

```sh
poetry config virtualenvs.in-project true

# https://github.com/numpy/numpy/issues/17807#issuecomment-731014921
brew install openblas
OPENBLAS="$(brew --prefix openblas)" poetry install
```
