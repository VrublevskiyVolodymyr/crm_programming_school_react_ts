import React, {FC} from 'react';

import {Pagination} from "../Pagination/Pagination";
import {IComment} from "../../interfaces";
import css from "./commentModal.module.css"

interface IProps {
    comments: IComment[];
    currentPage: number;
    commentsPerPage: number;
    onClose: () => void;
    total_pages: number;
    onPageChange: (newPage: number) => void;
}

const CommentModal: FC<IProps> = ({
                                      comments,
                                      currentPage,
                                      commentsPerPage,
                                      onClose,
                                      total_pages,
                                      onPageChange,
                                  }) => {
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    const handlePageChange = (newPage: number) => {
        onPageChange(newPage);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric'};
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }


    return (
        <div className={css.modal}>
            <div className={css.modal_content}>
                {currentComments.map((comment) => (
                    <div key={comment.id}>
                        <div className={css.comment}>
                            <div className={css.commentText}>{comment.comment}</div>
                            <div className={css.commentDetails}>
                                <span>{comment.manager.name}</span>
                                <span>  {comment.manager.surname}</span>
                                <span>{formatDate(comment.created_at)}</span>
                            </div>
                        </div>
                    </div>
                ))}

                <div className={css.modal_actions}>
                    <button onClick={onClose}>Close</button>
                </div>
                {total_pages > 1 && (
                    <Pagination
                        pageCount={total_pages || 1}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        isFirstPage={currentPage === 1}
                        isLastPage={currentPage === total_pages}
                    />
                )}
            </div>
        </div>
    );
};

export {CommentModal};