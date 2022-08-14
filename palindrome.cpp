class Solution {
public:
    string longestPalindrome(string s) {
        bool success = false;
        int bestLength = 0;
        string best;
        for (int i=0; i<s.length(); i++) {
            for (int j=i; j<s.length(); j++) {
                success = true;
                int l = j-i+1;
                if (l <= bestLength) {
                    continue;
                }
                // check each letter, if one does not satisfy, false
                for (int k=0; k<l; k++) {
                    if (s[i+k] != s[j-k] ){
                        success = false;
                        break;
                    }
                }
                if (success) {
                    bestLength = l;
                    best = s.substr(i,l);
                }
            }
        }

     return best;

    }
};
