import {AddBookRequest} from "../../../models/AddBookRequest";
import {useState} from "react";
import {useOktaAuth} from "@okta/okta-react";
import {base64ConversionForImages} from "../../../utils/imageUtils";
import {BookApi} from "../../../apis/bookApi";

export const AddNewBook = () => {

    const {authState} = useOktaAuth();

    // New Book
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [copies, setCopies] = useState(0);
    const [category, setCategory] = useState('Category');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // Displays
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    const submitNewBook = async () => {
        if (authState?.isAuthenticated && title !== '' && author !== '' && category !== 'Category'
            && description !== '' && copies >= 0) {
            const book: AddBookRequest = {title, author, description, copies, category};
            book.img = selectedImage;

            await BookApi.adminAddBook(authState, book);

            setTitle('');
            setAuthor('');
            setDescription('');
            setCopies(0);
            setCategory('Category');
            setSelectedImage(null);
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return (
        <div className='container mt-5 mb-5'>
            {displaySuccess &&
                <div className='alert alert-success' role='alert'>
                    Book added successfully
                </div>
            }
            {displayWarning &&
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out
                </div>
            }
            <div className='card'>
                <div className='card-header'>
                    Add a new book
                </div>
                <div className='card-body'>
                    <form method='POST'>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Title</label>
                                <input type="text" className='form-control' name='title' required
                                       onChange={e => setTitle(e.target.value)} value={title}/>
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Author </label>
                                <input type="text" className='form-control' name='author' required
                                       onChange={e => setAuthor(e.target.value)} value={author}/>
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Category</label>
                                <button className='form-control btn btn-secondary dropdown-toggle' type='button'
                                        id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                    {category}
                                </button>
                                <ul id='addNewBookId' className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li><span onClick={() => setCategory('FE')}
                                              className='dropdown-item'>Front End</span>
                                    </li>
                                    <li><span onClick={() => setCategory('BE')}
                                              className='dropdown-item'>Back End</span>
                                    </li>
                                    <li><span onClick={() => setCategory('Data')} className='dropdown-item'>Data</span>
                                    </li>
                                    <li><span onClick={() => setCategory('DevOps')}
                                              className='dropdown-item'>DevOps</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-md-12 mb-3'>
                            <label className='form-label'>Description</label>
                            <textarea className='form-control' id='exampleFormControlTextarea1' rows={3}
                                      onChange={e => setDescription(e.target.value)} value={description}></textarea>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <label className='form-label'>Copies</label>
                            <input type='number' className='form-control' name='Copies' required
                                   onChange={e => setCopies(Number(e.target.value))} value={copies}/>
                        </div>
                        <input type='file' onChange={e => base64ConversionForImages(e, setSelectedImage)}/>
                        <div>
                            <button type='button' className='btn btn-primary mt-3' onClick={submitNewBook}>
                                Add Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}