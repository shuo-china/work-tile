import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  theme: {
    width: {
      sidebar: '200px',
      'sidebar-collapsed': '64px',
      'project-sidebar': '55px'
    },
    height: {
      navigationbar: '56px'
    }
  },
  shortcuts: {
    'table-col-clickable': 'absolute inset-0 flex cursor-pointer items-center px-4 hover:bg-black/5'
  }
})
