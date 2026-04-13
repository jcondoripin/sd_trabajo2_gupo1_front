import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { API_BASE } from '../environment/context';
import api from '../environment/api';

export default function Dashboard({ user, onLogout }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchFiles = async () => {
    try {
      const res = await api.get('files');
      setFiles(res.data.files);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    try {
      await api.post('upload', formData);
      setMessage('Imagen subida correctamente');
      fetchFiles();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow p-5 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="text-2xl">👤</div>
          <div>
            <p className="font-semibold">Usuario {user.username}</p>
            <p className="text-xs text-gray-500">ID: {user.user_id}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="px-6 py-2 text-red-600 hover:bg-red-50 rounded-2xl font-medium transition-colors"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow p-8">
          <h1 className="text-2xl font-semibold mb-6">Subir imágenes</h1>
          
          <div
            {...getRootProps()}
            className={`border-4 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer
              ${isDragActive ? 'border-blue-600 bg-blue-50' : 'border-blue-300 bg-[#f0f7ff] hover:border-blue-500'}`}
          >
            <input {...getInputProps()} />
            <p className="text-lg font-medium">
              {isDragActive ? 'Suelta la imagen aquí...' : 'Arrastra imágenes aquí o haz clic para seleccionar'}
            </p>
            <p className="text-sm text-gray-500 mt-2">JPG, PNG, GIF • Máximo 5 MB</p>
          </div>

          {uploading && <p className="text-center mt-4 text-blue-600">Subiendo...</p>}
          {message && <p className="text-center mt-4 text-green-600 font-medium">{message}</p>}
        </div>

        <div className="bg-white rounded-3xl shadow p-8">
          <h2 className="text-xl font-semibold mb-6">Imágenes subidas ({files.length})</h2>
          
          {files.length === 0 ? (
            <p className="text-gray-400 text-center py-12">Aún no tienes imágenes</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {files.map((filename) => (
                <div key={filename} className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <img
                    src={`${API_BASE}/uploads/${filename}`}
                    alt={filename}
                    className="w-full aspect-square object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="text-[10px] p-2 bg-white text-center truncate">
                    {filename}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}