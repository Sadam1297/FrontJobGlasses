import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';

const GET_CHARACTERS = gql`
  query ($page: Int, $name: String) {
    characters(page: $page, filter: { name: $name }) {
      info {
        pages
        next
        prev
      }
      results {
        id
        name
        image
      }
    }
  }
`;

function App() {
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');

  const { data, loading, error } = useQuery(GET_CHARACTERS, {
    variables: { page, name },
  });

  if (error) return <p className="text-center text-red-500 mt-10">Error: {error.message}</p>;

  const characters = data?.characters?.results || [];
  const totalPages = data?.characters?.info?.pages || 1;  

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Rick & Morty</h1>

      <input
        className="p-3 border w-full mb-8 rounded shadow"
        placeholder="Search for a character..."
        value={name}
        onChange={(e) => {
          setPage(1);
          setName(e.target.value);
        }}
      />

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      <p className="text-center text-gray-600 mt-4 mb-6">
        Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span>
      </p>
        {loading && (
          < div className="text-center mb-4 text-sm text-gray-500 animate-pulse">
          Loading...
        </div>
        )}


        {/* Try to center everything without success. */}
        <div className="overflow-x-auto mb-10">
            <div className="flex space-x-4 w-max mx-auto justify-center">
          {characters.map((char: any) => (
            <div
              key={char.id}
              className="bg-white rounded-xl shadow-md w-48 flex-shrink-0 p-4 text-center transition-transform hover:scale-105"
            >
              <img
                src={char.image}
                alt={char.name}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <p className="font-semibold text-gray-800">{char.name}</p>
            </div>
          ))}
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}

export default App;

// PAGINATION COMPONENT
function Pagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}) {
  return (
    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded border disabled:opacity-50"
      >
        &lt;
      </button>

      <button
        onClick={() => setPage(1)}
        className={`px-3 py-1 rounded border ${
          page === 1 ? 'bg-blue-600 text-white font-bold' : 'bg-white'
        }`}
      >
        1
      </button>

      {page > 3 && <span className="px-2">...</span>}

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p > 1 && p < totalPages && Math.abs(p - page) <= 2)
        .map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded border ${
              page === p ? 'bg-blue-600 text-white font-bold' : 'bg-white'
            }`}
          >
            {p}
          </button>
        ))}

      {page < totalPages - 2 && <span className="px-2">...</span>}

      {totalPages > 1 && (
        <button
          onClick={() => setPage(totalPages)}
          className={`px-3 py-1 rounded border ${
            page === totalPages ? 'bg-blue-600 text-white font-bold' : 'bg-white'
          }`}
        >
          {totalPages}
        </button>
      )}

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 rounded border disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
}
