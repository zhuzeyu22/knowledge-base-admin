import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/console/api/get_folder_permission',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          id: 1,
          name: 'Alice',
          email: 'alice@example.com',
        },
      }
    },
  },
] satisfies MockMethod[]