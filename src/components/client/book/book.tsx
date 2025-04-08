import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBookByIdApi } from "services/api";
import { App } from "antd";
import BookDetail from "./book.detail";
import BookLoader from "./book.loader";

const BookPage = () => {
    let { id } = useParams();
    const { notification } = App.useApp();
    const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);
    const [isLoadingBoook, setIsLoadingBook] = useState<boolean>(false);

    useEffect(() => {
        if (id) {
            getBookById(id);
        }
    }, [id]);

    const getBookById = async (id: string) => {
        setIsLoadingBook(true);
        let res = await getBookByIdApi(id);
        if (res && res.data) {
            setCurrentBook(res.data);
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra!',
                description: res.message
            })
        }
        setIsLoadingBook(false);
    }

    return (
        <div>
            {isLoadingBoook ?
                <BookLoader />
                :
                <BookDetail
                    currentBook={currentBook}
                />
            }
        </div>
    )
}

export default BookPage;