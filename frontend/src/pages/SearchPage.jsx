import { SearchIcon } from "@chakra-ui/icons";
import {
    Avatar,
  Box,
  Button,
  Flex,
  Image,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

const SearchPage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();

  const fetchUsers = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/search?q=${query}`);
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      setSearchResults(data);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText.trim() !== "") {
        fetchUsers(searchText);
      } else {
        setSearchResults([]); // Clear results if input is empty
      }
    }, 300); // Debounce API calls
    return () => clearTimeout(timer);
  }, [searchText]);

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{ base: "100%", md: "80%", lg: "750px" }}
      p={4}
      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{ base: "column", md: "row" }}
        maxW={{ sm: "400px", md: "full" }}
        mx={"auto"}
      >
        <Flex flex={30} gap={2} flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
          <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
            Search Users
          </Text>
          <Flex alignItems={"center"} gap={2}>
            <Input
              placeholder="Search for a user"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button size={"sm"} isLoading={loading}>
              <SearchIcon />
            </Button>
          </Flex>

          {/* Show loading indicator */}
          {loading && (
            <Flex gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
              <Box>
								<SkeletonCircle size={"10"} />
							</Box>
              <Flex w={"full"} flexDirection={"column"} gap={3}>
									<Skeleton h={"10px"} w={"80px"} />
									<Skeleton h={"8px"} w={"90px"} />
								</Flex>
            </Flex>
          )}

          {/* Show search results only if input is not empty */}
          {searchText.trim() !== "" && searchResults.length > 0 && (
            <Box mt={4}>
              <Text fontWeight={700}>Suggestions</Text>
              {searchResults.map((user) => (
                <Link key={user._id} to={`/${user.username}`}>
                <Flex
                  gap={4}
                  alignItems={"center"}
                  p={"2"}
                  borderRadius={"md"}
                  cursor={"pointer"}
                >
                    <Box>
                      <Avatar
                        src={user.profilePic || "https://via.placeholder.com/150"}
                        alt={`${user.username}'s profile`}
                      />
                    </Box>
                    <Box>
                        <Text fontWeight={600} display={'flex'} alignItems={'center'}>{user.username} <Image src='/verified.png' w={4} h={4} ml={1} /></Text>
                        <Text fontSize={'sm'}>{user.name}</Text>
                    </Box>
                </Flex>
                </Link>
              ))}
            </Box>
          )}

          {/* Show no results message if no users match */}
          {searchText.trim() !== "" && searchResults.length === 0 && !loading && (
            <Box mt={4}>
              <Text fontWeight={600} color="gray.500">
                No users found.
              </Text>
            </Box>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default SearchPage;
