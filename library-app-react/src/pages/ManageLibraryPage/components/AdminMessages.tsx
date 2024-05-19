import {Pagination} from "../../../common/Pagination/Pagination";
import {SpinnerLoading} from "../../../common/SpinnerLoading/SpinnerLoading";
import {useEffect, useState} from "react";
import {MessageModel} from "../../../models/MessageModel";
import {useOktaAuth} from "@okta/okta-react";
import {AdminMessage} from "./AdminMessage";
import {MessagesApi} from "../../../apis/messagesApi";
import {AdminMessageRequest} from "../../../models/AdminMessageRequest";

export const AdminMessages = () => {

    const {authState} = useOktaAuth();

    // Normal Loading Pieces
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState("");

    // Messages endpoint State
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Recall useEffect
    const [btnSubmit, setBtnSubmit] = useState(false);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState && authState.isAuthenticated) {
                const searchUrl = `/search/findByClosed/?closed=false`;
                const responseData = await MessagesApi.getMessages(authState, currentPage - 1, messagesPerPage, searchUrl);
                const loadedMessages: MessageModel[] = responseData.content as MessageModel[];

                setMessages(loadedMessages);
                setTotalPages(responseData.totalPages);
            }
            setIsLoadingMessages(false);
        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [authState, currentPage, btnSubmit, messagesPerPage]);

    if (isLoadingMessages) {
        return (
            <SpinnerLoading/>
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }


    const submitResponseToQuestion = async (id: number, response: string) => {

        if (authState && authState?.isAuthenticated && id !== null && response !== '') {
            const messageAdminRequestModel: AdminMessageRequest = {id, response};
            await MessagesApi.adminReplyMessage(authState, messageAdminRequestModel);
            setBtnSubmit(!btnSubmit);
        }
    }

    return (
        <div className='mt-3'>
            {messages.length > 0 ?
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                        <AdminMessage message={message} key={message.id}
                                      submitResponseToQuestion={submitResponseToQuestion}/>
                    ))}
                </>
                :
                <h5>No pending Q/A</h5>
            }
            {totalPages > 1 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={setCurrentPage}/>}
        </div>
    );
}