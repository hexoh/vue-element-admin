const toPascalCase = (str) =>
  str.replace(/[:\-_]+(.)/g, (_, letter) => letter.toUpperCase()).replace(/^./, (s) => s.toUpperCase())

module.exports = {
  description: 'Create vue view',
  prompts: [
    {
      type: 'input',
      name: 'path',
      message: '请输入路径（Please enter a path）',
      default: 'views'
    },
    {
      type: 'input',
      name: 'name',
      message: '请输入模块名称（Please enter module name）'
    }
  ],
  actions: (data) => {
    const { name, path } = data
    const pascalName = toPascalCase(name)

    const actions = []
    if (name) {
      actions.push({
        type: 'add',
        path: `./src/views/${path}/${pascalName}.vue`,
        templateFile: './plop/view/view.hbs',
        data: {
          name,
          pascalName
        }
      })
    }

    return actions
  }
}
