from typing import List
import re

class AutocompleteService:
    @staticmethod
    def get_suggestions(code: str, cursor_position: int, language: str) -> List[str]:
        """
        Mock AI autocomplete service with rule-based suggestions
        """
        
        # Get the line at cursor position
        lines = code[:cursor_position].split('\n')
        current_line = lines[-1] if lines else ""
        
        suggestions = []
        
        if language == "python":
            suggestions = AutocompleteService._python_suggestions(current_line, code)
        elif language in ["javascript", "typescript"]:
            suggestions = AutocompleteService._javascript_suggestions(current_line, code)
        elif language == "java":
            suggestions = AutocompleteService._java_suggestions(current_line, code)
        
        return suggestions[:3]  # Return top 3 suggestions
    
    @staticmethod
    def _python_suggestions(current_line: str, full_code: str) -> List[str]:
        suggestions = []
        
        if "def " in current_line and "(" in current_line and current_line.strip().endswith(":"):
            suggestions.append('"""Function docstring"""')
            suggestions.append("pass")
        
        if current_line.strip().startswith("class "):
            suggestions.append("def __init__(self):")
            suggestions.append("pass")
        
        if "import " in current_line:
            suggestions.extend(["numpy as np", "pandas as pd", "matplotlib.pyplot as plt"])
        
        if current_line.strip().startswith("for "):
            suggestions.append("pass")
        
        if current_line.strip().startswith("if "):
            suggestions.append("pass")
        
        if "print(" in current_line:
            suggestions.append('f"Value: {variable}"')
        
        # Context-aware suggestions
        if "self." in current_line:
            suggestions.extend(["self.attribute", "self.method()"])
        
        return suggestions
    
    @staticmethod
    def _javascript_suggestions(current_line: str, full_code: str) -> List[str]:
        suggestions = []
        
        if "function " in current_line or "const " in current_line and "=>" in current_line:
            suggestions.append("return;")
        
        if "console." in current_line:
            suggestions.extend(["log()", "error()", "warn()"])
        
        if ".map(" in current_line:
            suggestions.append("(item) => item")
        
        if ".filter(" in current_line:
            suggestions.append("(item) => item !== null")
        
        if "async " in current_line:
            suggestions.append("await fetch()")
        
        return suggestions
    
    @staticmethod
    def _java_suggestions(current_line: str, full_code: str) -> List[str]:
        suggestions = []
        
        if "public class " in current_line:
            suggestions.append("public static void main(String[] args) {")
        
        if "System.out." in current_line:
            suggestions.extend(["println()", "print()"])
        
        if "public " in current_line and "(" in current_line:
            suggestions.append("return;")
        
        return suggestions