import React from 'react';
import axios from 'axios';
import './Uploader.css';

export default class Uploader extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      loading: false,
      items: [],
      downloading: false,
      progress: [],
    }
  }

  componentDidMount = async() => {
    this.getLinks('https://store.neuro-city.ru/downloads/for-test-tasks')
  }

  getLinks =  (url) => {
    const currentUrl = url;

    axios.get(url, { responseType: 'json' })
    .then((response) => {
      let fileLinks = [];
      let promises = [];

      response.data.forEach((element) => {
        const name = element.name;
        const newUrl = `${currentUrl}/${name}`;

        if (element.type === 'directory') {
          console.log('D', element);
          promises.push(this.getLinks(newUrl));
        } else if (element.type === 'file') {
          console.log('F', element.name, element.size);
          fileLinks.push(newUrl);
        }
      });
      return Promise.all(promises).then(() => fileLinks);
    })
    .then((files) => {
      const allItems = [...this.state.items, ...files];
      this.setState({ items: allItems }, () => {
        console.log(this.state.items.length);
      });
    })
    .catch(error => {
      console.error('Ошибка получения ссылок:', error);
    });
  }

  downloadFiles = async () => {
    const { items } = this.state;

    this.setState({ downloading: true });
    const validItems = [];
    const progress = [];

    try {
      await Promise.all(items.map(async (url) => {
        const headResponse = await axios.head(url);
        const contentLength = headResponse.headers['content-length'];

        if (contentLength && contentLength > 0) {
          validItems.push(url);
          progress.push(0);
        }
      }));

      const promises = validItems.map((url, index) => {
        return axios.get(url, {
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            this.setState(state => {
              const newProgress = [...state.progress];
              newProgress[index] = percentCompleted;
              return { progress: newProgress };
            });
          },
        }).then(response => {
          const blob = new Blob([response.data]);
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', `file-${index + 1}.txt`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
        });
      });

      await Promise.all(promises);

    } catch (error) {
      console.error('Ошибка при скачивании файлов:', error);
    } finally {
      this.setState({ downloading: false });
    }
  }

  render() {
    return (
      <div className='container'>
        <h1>Загрузчик файлов</h1>
            <button onClick={this.downloadFiles} disabled={this.state.downloading}>
                {this.state.downloading ? 'Скачивание...' : 'Скачать все'}
            </button>
            {this.state.progress.map((percent, index) => (
                <div key={index}>
                    <p>Файл {index + 1}: {percent}%</p>
                    <progress value={percent} max="100" />
                </div>
            ))}
      </div>
    )
  }
}