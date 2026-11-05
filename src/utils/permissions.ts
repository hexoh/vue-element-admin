function processChild(child: { type: number; children: any[] | undefined; permissionList: any[] }) {
  if (child.type === 1) {
    if (child.children && child.children.length > 0) {
      if (child.children[0].type === 2) {
        const pers: any[] = []
        child.children.forEach((type2Item) => {
          pers.push({
            id: type2Item.permissionId,
            label: type2Item.title,
            value: type2Item.name
          })
        })
        child.permissionList = pers
        child.children = undefined
      } else {
        convertType2ToPermissions(child.children)
      }
    }
  } else {
    convertType2ToPermissions(child.children!)
  }
}
function convertType2ToPermissionsImpl(ls: any[]) {
  if (ls && ls.length > 0) {
    ls.forEach((item) => {
      processChild(item)
    })
  }
}

export function convertType2ToPermissions(ls: any[]) {
  convertType2ToPermissionsImpl(ls)
  return ls
}
