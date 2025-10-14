
interface HttpError extends Error {
    status?: number;
}

export default HttpError;