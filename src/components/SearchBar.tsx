// Ao contrário do Atlas (onde a pesquisa filtrava uma lista local, sem
// custo nenhum), aqui CADA pesquisa gasta pedidos reais contra um
// limite de 60/hora. Por isso esta barra NÃO pesquisa a cada letra —
// só quando o utilizador submete (Enter ou clique), tal como uma
// barra de pesquisa "clássica". É uma escolha de UX deliberada,
// baseada numa restrição real da API, não um acaso.
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface SearchBarProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(value);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <FaGithub size={20} className="search-bar__icon" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="username do GitHub (ex.: torvalds)"
        autoComplete="off"
        spellCheck={false}
      />
      <button type="submit" disabled={isLoading || value.trim() === ""}>
        <Search size={17} strokeWidth={2.4} aria-hidden="true" />
        <span>{isLoading ? "A procurar..." : "Analisar"}</span>
      </button>
    </form>
  );
}
