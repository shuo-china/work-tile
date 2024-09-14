import config from '@/config'

export function download(id: number, fileName: string) {
  const x = new window.XMLHttpRequest()
  x.open('GET', config.apiBaseURL + `/erp_file/download?id=${id}`, true)
  x.responseType = 'blob'
  x.onload = () => {
    const url = window.URL.createObjectURL(x.response)
    const a = document.createElement('a')
    a.href = url
    a.setAttribute('download', fileName)
    a.style.display = 'none'
    document.body.append(a)
    a.click()
    document.body.removeChild(a)
  }
  x.send()
}
