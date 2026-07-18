const CLIENT_ID = "553415727551-mfmp25am0vcqnv31ojoakltj3atnh55r.apps.googleusercontent.com";
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const FILE_NAME = 'dragons-academy-backup.json';

let tokenClient: any;
let gapiInited = false;

export const initDrive = (onSuccess: () => void) => {
  if (typeof window === 'undefined') return;

  const checkGapi = setInterval(() => {
    if (window.gapi && window.google) {
      clearInterval(checkGapi);
      window.gapi.load('client', async () => {
        await window.gapi.client.init({
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        });
        gapiInited = true;
        
        tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // defined later
        });
        
        onSuccess();
      });
    }
  }, 100);
};

export const syncToDrive = async (data: any, onStatus: (msg: string) => void) => {
  if (!gapiInited) {
    onStatus('Menginisialisasi Google Drive...');
    return;
  }

  const doUpload = async (token: string) => {
    try {
      onStatus('Mencari file backup...');
      const response = await window.gapi.client.drive.files.list({
        q: `name='${FILE_NAME}' and trashed=false`,
        spaces: 'drive',
        fields: 'files(id, name)',
      });

      const files = response.result.files;
      const fileContent = JSON.stringify(data);
      const metadata = {
        name: FILE_NAME,
        mimeType: 'application/json',
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([fileContent], { type: 'application/json' }));

      if (files && files.length > 0) {
        // Update existing
        onStatus('Memperbarui backup...');
        const fileId = files[0].id;
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`, {
          method: 'PATCH',
          headers: new Headers({ Authorization: 'Bearer ' + token }),
          body: form,
        });
        onStatus('Backup berhasil diperbarui!');
      } else {
        // Create new
        onStatus('Membuat backup baru...');
        await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: new Headers({ Authorization: 'Bearer ' + token }),
          body: form,
        });
        onStatus('Backup berhasil dibuat!');
      }
    } catch (err: any) {
      console.error(err);
      onStatus('Gagal menyimpan: ' + err.message);
    }
  };

  tokenClient.callback = async (resp: any) => {
    if (resp.error !== undefined) {
      onStatus('Login gagal.');
      throw (resp);
    }
    await doUpload(resp.access_token);
  };

  if (window.gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    tokenClient.requestAccessToken({ prompt: '' });
  }
};

export const restoreFromDrive = async (onData: (data: any) => void, onStatus: (msg: string) => void) => {
  if (!gapiInited) return;

  const doDownload = async (token: string) => {
    try {
      onStatus('Mencari file backup...');
      const response = await window.gapi.client.drive.files.list({
        q: `name='${FILE_NAME}' and trashed=false`,
        spaces: 'drive',
        fields: 'files(id, name)',
      });

      const files = response.result.files;
      if (files && files.length > 0) {
        onStatus('Mengunduh backup...');
        const fileId = files[0].id;
        const result = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
          headers: new Headers({ Authorization: 'Bearer ' + token }),
        });
        const data = await result.json();
        onData(data);
        onStatus('Backup berhasil dipulihkan!');
      } else {
        onStatus('File backup tidak ditemukan.');
      }
    } catch (err: any) {
      console.error(err);
      onStatus('Gagal memulihkan: ' + err.message);
    }
  };

  tokenClient.callback = async (resp: any) => {
    if (resp.error !== undefined) {
      onStatus('Login gagal.');
      throw (resp);
    }
    await doDownload(resp.access_token);
  };

  if (window.gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    tokenClient.requestAccessToken({ prompt: '' });
  }
};
