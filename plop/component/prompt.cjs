const toPascalCase = (str) =>
  str.replace(/[:\-_]+(.)/g, (_, letter) => letter.toUpperCase()).replace(/^./, (s) => s.toUpperCase())

const toKebabCase = (str) =>
  str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[:_]+/g, '-').toLowerCase()

module.exports = {
  description: 'Create vue component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '请输入组件名称（Please enter the component name）'
    }
  ],
  actions: (data) => {
    const { name } = data
    const pascalName = toPascalCase(name)
    const kebabName = toKebabCase(name)

    const actions = []
    if (name) {
      actions.push({
        type: 'add',
        path: `./src/components/${kebabName}/src/${pascalName}.vue`,
        templateFile: './plop/component/component.hbs',
        data: {
          name,
          kebabName,
          pascalName
        }
      }, {
        type: 'add',
        path: `./src/components/${kebabName}/index.ts`,
        templateFile: './plop/component/index.hbs',
        data: {
          pascalName
        }
      })
    }

    return actions
  }
}
