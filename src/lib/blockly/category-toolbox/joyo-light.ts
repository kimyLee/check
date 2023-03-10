export default {
  kind: 'category',
  name: '灯效',
  cssConfig: {
    container: 'category-joyo',
  },
  contents: [
    {
      kind: 'block',
      type: 'set_light_by_ui',
    },
    {
      kind: 'block',
      type: 'set_light',
    },
    {
      kind: 'block',
      type: 'set_all_light',
    },
    {
      kind: 'block',
      type: 'set_all_light_color',
    },
    {
      kind: 'block',
      type: 'set_light_animation',
    },
    {
      kind: 'block',
      type: 'clear_light',
    },
  ],
}
