module.exports = {
    "env": {
        "node": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "linebreak-style": 0,
        "prefer-destructuring": 0,
        "no-param-reassign": ["error", { "props": false }],
        "import/extensions": 0,
        "import/prefer-default-export": 0,
    }
}
