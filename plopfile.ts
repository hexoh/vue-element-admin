import type { NodePlopAPI } from 'plop'
import viewGenerator from './plop/view/prompt.cjs'
import componentGenerator from './plop/component/prompt.cjs'

export default function (plop: NodePlopAPI) {
  plop.setGenerator('view', viewGenerator)
  plop.setGenerator('component', componentGenerator)
}
