import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StarButton from '../components/StarButton';

const BookDetail = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(response.data);

        const recResponse = await axios.get(`http://localhost:5000/api/books/recommended/${id}`);
        setRecommendedBooks(recResponse.data);

        const commentsResponse = await axios.get(`http://localhost:5000/api/books/${id}/comments`);
        setComments(commentsResponse.data); // userId ve userName içermeli
      } catch (error) {
        console.error('Kitap bilgileri alınırken hata oluştu: ', error);
      }
    };
    fetchBook();

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    } else {
      setErrorMessage('Kullanıcı bilgisi bulunamadı.');
    }
  }, [id]);

  const handleAddComment = async () => {
    if (!user || !user.id) {
      setErrorMessage('Yorum yapmak için giriş yapmalısınız!');
      return;
    }

    if (newComment.trim() === '') {
      setErrorMessage('Yorum boş olamaz!');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/books/${id}/comments`, {
        content: newComment,
        userId: user.id,
        userName: user.name,
      });
      setComments([...comments, response.data]);
      setNewComment('');
      setErrorMessage('');
    } catch (error) {
      console.error('Yorum eklenirken hata oluştu: ', error);
      setErrorMessage('Yorum eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Yorum silinirken hata oluştu: ', error);
      setErrorMessage('Yorum silinirken bir hata oluştu.');
    }
  };

  const handleCardClick = (bookId) => {
    navigate(`/book/${bookId}`);
};


  return (
    <div className="container mt-4">
      {book ? (
        <>
          <h2>{book.title}</h2>
          <div className="row">
            <div className="col-md-4">
              <img src={`/images/${book.image_url}`} alt={book.title} className="img-fluid rounded" />
            </div>
            <div className="col-md-8">
              <p><strong>Yazar:</strong> {book.author}</p>
              <p><strong>Açıklama:</strong> {book.description}</p>
              <p><strong>Fiyat:</strong> {book.price} TL</p>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); addToCart(book); }}>Sepete Ekle</button>
                <StarButton bookId={book.id} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Yükleniyor...</p>
      )}

      <div className="mt-4">
        <h4>Kullanıcı Yorumları</h4>
        {comments.length > 0 ? (
          <ul className="list-group">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{comment.userName}:</strong> {/* Kullanıcı adı */}
                  <span className="ms-2">{comment.content}</span>
                </div>
                {comment.userId === user.id && ( // Yalnızca yorumu yazan kullanıcı silebilir
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Sil
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Henüz yorum yapılmamış.</p>
        )}
        <div className="mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Yorumunuzu yazın..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleAddComment}>
            Yorum Ekle
          </button>
          {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
        </div>
      </div>

      <div className="mt-4">
        <h4>Benzer Kitaplar</h4>
        <div className="row">
          {recommendedBooks.map((recBook) => (
            <div
              className="col-md-4"
              key={recBook.id}
              onClick={() => handleCardClick(recBook.id)}
              style={{ cursor: 'pointer' }}
            >
              <div
                className="card hover-shadow"
                style={{ border: '1px solid #ddd', borderRadius: '8px', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div className="card-body">
                  <h5 className="card-title">{recBook.title}</h5>
                  <p className="card-text">Yazar: {recBook.author}</p>
                  <p className="card-text">Fiyat: {recBook.price} TL</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
