const http = require("http");
const { nanoid } = require("nanoid");

const PORT = 9000;
let books = [];

// parsing JSON
const parseJson = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        console.error(`Failed to parse JSON: ${body}`);
        reject(err);
      }
    });
  });
};

// kirim response
const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(data));
};

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/books") {
    try {
      const book = await parseJson(req);

      if (!book.name) {
        return sendResponse(res, 400, {
          status: "fail",
          message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
      }
      if (book.readPage > book.pageCount) {
        return sendResponse(res, 400, {
          status: "fail",
          message:
            "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
      }

      const id = nanoid();
      const finished = book.pageCount === book.readPage;
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;

      const newBook = { id, ...book, finished, insertedAt, updatedAt };
      books.push(newBook);
      return sendResponse(res, 201, {
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: { bookId: id },
      });
    } catch (err) {
      console.error(err);
      return sendResponse(res, 400, {
        status: "fail",
        message: "Gagal menambahkan buku. Bad Request",
      });
    }
  }

  if (req.method === "PUT" && req.url.startsWith("/books/")) {
    const bookId = req.url.split("/")[2];
    const bookIndex = books.findIndex((b) => b.id === bookId);
    if (bookIndex === -1) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      });
    }

    try {
      const book = await parseJson(req);
      if (!book.name) {
        return sendResponse(res, 400, {
          status: "fail",
          message: "Gagal memperbarui buku. Mohon isi nama buku",
        });
      }
      if (book.readPage > book.pageCount) {
        return sendResponse(res, 400, {
          status: "fail",
          message:
            "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
      }

      const updatedBook = {
        ...books[bookIndex],
        ...book,
        finished: book.pageCount === book.readPage,
        updatedAt: new Date().toISOString(),
      };
      books[bookIndex] = updatedBook;
      return sendResponse(res, 200, {
        status: "success",
        message: "Buku berhasil diperbarui",
      });
    } catch (err) {
      console.error(err);
      return sendResponse(res, 400, {
        status: "fail",
        message: "Gagal memperbarui buku. Bad Request",
      });
    }
  }

  if (req.method === "GET" && req.url === "/books") {
    const { finished, name } = new URL(req.url, `http://${req.headers.host}`)
      .searchParams;

    let resultBooks = books;

    if (finished) {
      const isFinished = finished === "1";
      resultBooks = resultBooks.filter((book) => book.finished === isFinished);
    }

    if (name) {
      resultBooks = resultBooks.filter((book) =>
        book.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    return sendResponse(res, 200, {
      status: "success",
      data: {
        books: resultBooks.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    });
  }

  if (req.method === "GET" && req.url.startsWith("/books/")) {
    const bookId = req.url.split("/")[2];
    const book = books.find((b) => b.id === bookId);
    if (book) {
      return sendResponse(res, 200, { status: "success", data: { book } });
    } else {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Buku tidak ditemukan",
      });
    }
  }

  if (req.method === "DELETE" && req.url.startsWith("/books/")) {
    const bookId = req.url.split("/")[2];
    const bookIndex = books.findIndex((b) => b.id === bookId);
    if (bookIndex === -1) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      });
    }

    books.splice(bookIndex, 1);
    return sendResponse(res, 200, {
      status: "success",
      message: "Buku berhasil dihapus",
    });
  }

  sendResponse(res, 404, {
    status: "fail",
    message: "Endpoint tidak ditemukan",
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
